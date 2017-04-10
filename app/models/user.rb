class User < ApplicationRecord
  EMAIL_REGEX = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  has_many :recipes

  before_save do
    self.email = self.email.downcase
  end

  validates :name,  presence: true,
                    length: {maximum: 50}

  validates :email, presence: true,
                    length: {maximum: 255},
                    format: {:with => EMAIL_REGEX},
                    uniqueness: {case_sensitive: false}

  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }
  validates_confirmation_of :password
  
  validates :location, allow_blank: true,
                       length: {maximum: 100}
end
