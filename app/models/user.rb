class User < ApplicationRecord

  has_many :recipes

  attr_accessor :remember_token, :activation_token, :reset_token

  before_save :email_downcase
  before_create :create_activation_digest

  EMAIL_REGEX = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  validates :name,  presence: true,
                    length: {maximum: 50}

  validates :email, presence: true,
                    length: {maximum: 255},
                    format: {:with => EMAIL_REGEX},
                    uniqueness: {case_sensitive: false}

  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_blank: true
  validates_confirmation_of :password, allow_blank: true
  validates :location, allow_blank: true,
                       length: {maximum: 100}

  #return a random token for login persistence
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  #returns a BCrypt digest of the passed token
  def User.digest(token)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(token, cost: cost)
  end

  #remember a user session by supplying a token and storing its hash in the db
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  #return true if passed token matches encrypted digest
  def authenticated?(attribute, token)
    digest = self.send("#{attribute}_digest")
    if(digest.nil?)
      return false
    end
    BCrypt::Password.new(digest).is_password?(token)
  end

  #set password reset attributes.
  def create_reset_digest
    self.reset_token = User.new_token
    update_attribute(:reset_digest, User.digest(reset_token))
    update_attribute(:reset_sent_at, Time.zone.now)
  end

  #send password reset email.
  def send_pw_reset_mail
    UserMailer.password_reset(self).deliver_now
  end

  #return true if a password reset has expired.
  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  private
    #creates user account activation token and digest
    def create_activation_digest
      self.activation_token = User.new_token
      self.activation_digest = User.digest(activation_token)
    end

    def email_downcase
      self.email = self.email.downcase
    end

end
