class Admin::PagesController < Admin::AdminController
  include HighVoltage::StaticPage
  authorize_resource class: false, only: [:show]
end
