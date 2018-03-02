import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

imagemin(['static/images/*.{jpg,png}'], 'static/images', {
  plugins: [imageminWebp(), imageminMozjpeg(), imageminPngquant()],
}).then(files => console.log(files));
