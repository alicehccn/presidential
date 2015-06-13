class Users::RegistrationsController < Devise::RegistrationsController

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end

  def sign_out_params
    params.require(:user)
  end

  def sign_up_params
    params.require(:user).permit(:email, :username, :password, :password_confirmation)
  end

  private :sign_in_params, :sign_out_params, :sign_up_params
end