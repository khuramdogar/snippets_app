class SnippetLike < ApplicationRecord
  belongs_to :snippet
  belongs_to :user

  validates :user_id, uniqueness: { scope: :snippet_id }
end
