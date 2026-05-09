class User < ApplicationRecord
    include Devise::JWT::RevocationStrategies::JTIMatcher
    # Include default devise modules. Others available are:
    # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
    devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

    has_many :boards, dependent: :destroy
    has_many :snippets, through: :boards
    has_many :snippet_likes, dependent: :destroy
    has_many :snippet_comments, dependent: :destroy

    validates :name, presence: true
    validates :email, presence: true, uniqueness: true
end
