class PresidentialController < ApplicationController
  require 'net/http'
  require 'uri'

  def index
    render :app
  end

  def presentation
    unless params[:url]
      render :nothing
    end
      presentation = Net::HTTP.get(URI.parse(params[:url]))
      render :text => presentation
  end
end
