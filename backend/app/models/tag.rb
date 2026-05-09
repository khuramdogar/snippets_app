class Tag < ApplicationRecord
  has_many :snippet_tags, dependent: :destroy
  has_many :snippets, through: :snippet_tags

  validates :name, presence: true, uniqueness: true
end
