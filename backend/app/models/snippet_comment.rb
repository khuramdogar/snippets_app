class SnippetComment < ApplicationRecord
  belongs_to :snippet
  belongs_to :user

  validates :body, presence: true
end
