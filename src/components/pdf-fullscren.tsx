import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useToast } from '@/components/ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';

type PdfFullscrenProps = {
  fileUrl: string;
}

const PdfFullscren = ({ fileUrl }: PdfFullscrenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => {
      if (!v)
        setIsOpen(v);
    }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label={'fullscreen'} variant={'ghost'} className={'gap-1.5'}>
          <Expand className={'h-4 w-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className={'max-w-7xl w-full'}>
        <SimpleBar autoHide={false} className={'max-h-[calc(100vh-10rem)] mt-6'}>
          <div ref={ref}>
            <Document
              loading={<div className={'flex justify-center'}>
                <Loader2 className={'w-6 h-6 my-24 animate-spin'} />
              </div>}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => {
                toast({
                  title: 'Error',
                  description: 'Failed to load PDF',
                  variant: 'destructive'
                });
              }}
              className={'max-h-full'} file={fileUrl}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width? width : 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscren;