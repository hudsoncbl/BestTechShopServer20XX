import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as stream from 'stream';

@Injectable()
export class UploadService {
  private drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({
      version: 'v3',
      auth,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const response = await this.drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.originalname}`,
        mimeType: file.mimetype,
        parents: ['YOUR_FOLDER_ID'],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    const fileId = response.data.id;

    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return `https://drive.google.com/uc?id=${fileId}`;
  }
}
