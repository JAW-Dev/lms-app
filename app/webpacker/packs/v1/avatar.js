import EXIF from "exif-js";

const previewImage = (input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarPreview = document.getElementById("avatar-preview");
      const avatarPreviewImg = document.getElementById("avatar-preview__img");
      avatarPreview.classList.remove("hidden");
      avatarPreviewImg.setAttribute("xlink:href", e.target.result);

      EXIF.getData(input.files[0], function getImgData() {
        const orientation = EXIF.getTag(this, "Orientation");
        switch (orientation) {
          case 5:
          case 6:
            avatarPreviewImg.classList.add("avatar-preview__img--cw");
            break;
          case 7:
          case 8:
            avatarPreviewImg.classList.add("avatar-preview__img--ccw");
            break;
          default:
            break;
        }
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const avatarPicker = document.getElementById("user_profile_attributes_avatar");
if (avatarPicker) {
  avatarPicker.addEventListener("change", (e) => previewImage(e.target));
}
