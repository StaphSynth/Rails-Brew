module SessionsHelper

  def log_in(user)
    session[:user_id] = user.id
    cookies.permanent.signed[:user_id] = user.id
  end

  def log_out
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end

  #return the current user
  def current_user
    if(session[:user_id])
      @current_user ||= User.find_by(id: session[:user_id])
    elsif(cookies.signed[:user_id])
      user = User.find_by(id: cookies.signed[:user_id])
      if(user && user.authenticated?(cookies[:remember_token]))
        log_in(user)
        @current_user = user
      end
    end
  end

  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  #true if user is logged in, else false
  def logged_in?
    !current_user.nil?
  end

  #returns true if the passed user is the current user, else false
  def current_user?(user)
    user == current_user ? true : false
  end

  #stores requested URL for redirect after authorization checks complete
  def store_req_url
    session[:forwarding_url] = request.original_url if request.get?
  end

  #returns stored requested URL default if there isn't one.
  def req_url?(default)
    url = session[:forwarding_url] || default
    session.delete(:forwarding_url)
    return url
  end
end
