class EmailImagesController < ApplicationController
    skip_before_action :verify_authenticity_token
    def upload_email_image
        blob = ActiveStorage::Blob.create_and_upload!(io: params[:file], filename: params[:file]&.original_filename )

        render json:{image_url: "#{blob.service_url}"}
    end
end