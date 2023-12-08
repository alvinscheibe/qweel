'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import PdfFullscren from '@/components/pdf-fullscren';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PdfRendererProps = {
  url: string;
};

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  const customPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
  });

  type CustomPageValidator = z.infer<typeof customPageValidator>;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CustomPageValidator>({
    defaultValues: {
      page: '1'
    },
    resolver: zodResolver(customPageValidator)
  });

  function handlePageSubmit(data: CustomPageValidator) {
    console.log(data);
    setCurrentPage(Number(data.page));
    setValue('page', String(data.page));
  }

  return (
    <div className={'w-full bg-white rounded-md shadow flex flex-col items-center'}>
      <div className={'h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'}>
        <div className={'flex items-center gap-1.5'}>
          <Button
            variant={'ghost'}
            aria-label={'previous page'}
            onClick={() => {
              setCurrentPage((prev) => prev - 1 > 1 ? prev - 1 : 1);
              setValue('page', String(currentPage - 1));
            }}
            disabled={currentPage <= 1}
          >
            <ChevronDown className={'h-4 w-4'} />
          </Button>

          <div className={'flex items-center gap-1.5'}>
            <Input
              {...register('page')}
              className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)()
                }
              }}
            />
            <p className={'text-zinc-700 text-sm space-x-1'}>
              <span>/</span>
              <span>{numPages ?? '...'}</span>
            </p>
          </div>

          <Button
            variant={'ghost'}
            aria-label={'next page'}
            onClick={() => {
              setCurrentPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1))
              setValue('page', String(currentPage + 1));
            }}
            disabled={currentPage >= numPages! || numPages === undefined}
          >
            <ChevronUp className={'h-4 w-4'} />
          </Button>
        </div>

        <div className={'space-x-2'}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label={'zoom'} variant={'ghost'} className={'gap-1.5'}>
                <Search className={'w-4 h-4'} />
                {scale * 100}%<ChevronDown className={'w-3 h-3 opacity-50'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant={'ghost'} aria-label={'rotate 90 degrees'} onClick={() => setRotation((prev) => prev + 90)}>
            <RotateCw className={'w-4 h-4'} />
          </Button>

          <PdfFullscren fileUrl={url} />
        </div>
      </div>

      <div className={'flex-1 w-full max-h-screen'}>
        <SimpleBar autoHide={false} className={'max-h-[calc(100vh-10rem)]'}>
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
              className={'max-h-full'} file={url}
            >
              <Page pageNumber={currentPage} width={width? width : 1} scale={scale} rotate={rotation} />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;