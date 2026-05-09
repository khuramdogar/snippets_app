class Board < ApplicationRecord
  belongs_to :user
  has_many :snippets, dependent: :destroy

  validates :title, presence: true
  validates :user, presence: true
end
