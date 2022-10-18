class EmailImagesController < ApplicationController
    skip_before_action :verify_authenticity_token
    def upload_email_image
        blob = ActiveStorage::Blob.create_and_upload!(io: params[:file], filename: params[:file]&.original_filename )
        url = URI(blob.service_url)
        render json:{image_url: "#{url.scheme}://#{url.host}/#{blob.key}"}
    end
end