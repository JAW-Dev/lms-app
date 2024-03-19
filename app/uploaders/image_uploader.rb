class ImageUploader < CarrierWave::Uploader::Base
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    if Rails.env.test? || Rails.env.ci?
      'spec/support/uploads/tmp'
    else
      "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    end
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  def default_url(*args)
    # For Rails 3.1+ asset pipeline compatibility:
    ActionController::Base.helpers.asset_path('blank.png')
  end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  def auto_orient
    manipulate! do |img|
      img.auto_orient
      img
    end
  end

  process :auto_orient

  # Create different versions of your uploaded files:
  version :thumb do
    process resize_to_fill: [500, 500]
  end

  version :large do
    process resize_to_fit: [1000, 1000]
  end

  version :small do
    process resize_to_fit: [500, 500]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_whitelist
    %w[jpg jpeg gif png webp]
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
end
