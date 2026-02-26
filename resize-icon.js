const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// مجاني الحفظ
const dirs = {
  'hdpi': 'android/app/src/main/res/mipmap-hdpi',
  'mdpi': 'android/app/src/main/res/mipmap-mdpi',
  'xhdpi': 'android/app/src/main/res/mipmap-xhdpi',
  'xxhdpi': 'android/app/src/main/res/mipmap-xxhdpi',
  'xxxhdpi': 'android/app/src/main/res/mipmap-xxxhdpi'
};

// أحجام الصور
const sizes = {
  'hdpi': 72,
  'mdpi': 48,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

// تحويل الصورة
async function resizeIcon() {
  try {
    for (const [density, size] of Object.entries(sizes)) {
      const dir = dirs[density];
      
      // التأكد من وجود المجلد
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // تحويل الصورة
      await sharp('icon.png')
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(path.join(dir, 'ic_launcher.png'));
      
      console.log(`✓ تم حفظ ${density}: ${size}x${size}`);
    }
    
    console.log('\n✅ تم تحويل جميع الأحجام بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

resizeIcon();
