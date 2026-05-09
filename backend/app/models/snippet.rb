class Snippet < ApplicationRecord
  belongs_to :board
  has_many :snippet_tags, dependent: :destroy
  has_many :tags, through: :snippet_tags
  has_many :snippet_likes, dependent: :destroy
  has_many :snippet_comments, dependent: :destroy

  validates :title, presence: true
  validates :content, presence: true
end
