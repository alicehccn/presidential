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
      slides = GitHub::Markdown.render(presentation)
      render :json => { slides: slides }
  end

  def logout
    cookies.delete(:presidential_access_tokens)
    redirect_to '/'
  end

  def terms
  end

  def privacy
  end

  def contact
  end
end
