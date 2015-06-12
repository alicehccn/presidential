class UserSessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      flash[:success] = "Welcome back!"
      redirect_to presentation_path
    else
      flash[:error] = "An error has occured with your login. Please check your email and password and try again."
      render action: 'new'
    end
  end
end
