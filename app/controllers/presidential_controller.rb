class PresidentialController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'pry'

  def index
    render :app
  end

  def presentation
    unless params[:url]
      render :nothing
    end
      presentation = Net::HTTP.get(URI.parse(params[:url]))
      slides = presentation.split("<!--- break -->").map do |slide|
        GitHub::Markdown.render(slide)
      end
      render :json => { slides: slides }
  end
end
