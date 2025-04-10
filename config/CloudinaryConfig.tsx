import { Cloudinary } from "@cloudinary/url-gen";
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
    apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: process.env.EXPO_PUBLIC_CLOUDINARY_SECRETE,
  },
  url: {
    secure: true,
  },
});

export const options = {
  upload_preset: "campus-guid",
  tag: "sample",
  unsigned: true,
};
