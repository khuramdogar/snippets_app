# db/seeds.rb

# Clear existing data
SnippetTag.destroy_all
Tag.destroy_all
Snippet.destroy_all
Board.destroy_all
User.destroy_all

puts "Seeding Users..."
users = []
5.times do |i|
  users << User.create!(
    name: "User #{i + 1}",
    email: "user#{i + 1}@example.com",
    password: '123123'
  )
end

puts "Seeding Boards..."
boards = []
users.each do |user|
  2.times do |i|
    boards << Board.create!(
      title: "Board #{i + 1} for #{user.name}",
      description: "A sample board description",
      user: user,
      is_public: [true, false].sample
    )
  end
end

puts "Seeding Snippets..."
snippets = []
boards.each do |board|
  5.times do |i|
    snippets << Snippet.create!(
      title: "Snippet #{i + 1} for #{board.title}",
      content: "Sample content for snippet #{i + 1}",
      board: board,
      is_public: [true, false].sample
    )
  end
end

puts "Seeding Tags..."
tags = []
5.times do |i|
  tags << Tag.create!(
    name: "Tag#{i + 1}"
  )
end

puts "Seeding SnippetTags..."
snippets.each do |snippet|
  snippet.tags << tags.sample(2) # Assign 2 random tags to each snippet
end

puts "Seeding completed!"
