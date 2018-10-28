/* eslint-disable import/no-extraneous-dependencies */
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
/* eslint-enable import/no-extraneous-dependencies */

imagemin(['static/images/*.{jpg,png}'], 'static/images', {
  plugins: [imageminWebp(), imageminMozjpeg(), imageminPngquant()],
}).then(files =>
  files.forEach(file => console.log(`${file.path} saved successfully`))
);
