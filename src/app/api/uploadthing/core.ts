import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user.id || !user.id)
        throw new Error('Unauthorized');

      return {
        userId: user.id,
      };
    })
    // @ts-ignore
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;