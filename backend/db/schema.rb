# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_05_09_120300) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "boards", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.bigint "user_id", null: false
    t.boolean "is_public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_boards_on_user_id"
  end

  create_table "snippet_comments", force: :cascade do |t|
    t.bigint "snippet_id", null: false
    t.bigint "user_id", null: false
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["snippet_id"], name: "index_snippet_comments_on_snippet_id"
    t.index ["user_id"], name: "index_snippet_comments_on_user_id"
  end

  create_table "snippet_likes", force: :cascade do |t|
    t.bigint "snippet_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["snippet_id", "user_id"], name: "index_snippet_likes_on_snippet_id_and_user_id", unique: true
    t.index ["snippet_id"], name: "index_snippet_likes_on_snippet_id"
    t.index ["user_id"], name: "index_snippet_likes_on_user_id"
  end

  create_table "snippet_tags", force: :cascade do |t|
    t.bigint "snippet_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["snippet_id"], name: "index_snippet_tags_on_snippet_id"
    t.index ["tag_id"], name: "index_snippet_tags_on_tag_id"
  end

  create_table "snippets", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.bigint "board_id", null: false
    t.boolean "is_public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "language", default: "javascript", null: false
    t.text "description"
    t.index ["board_id"], name: "index_snippets_on_board_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "jti", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "boards", "users"
  add_foreign_key "snippet_comments", "snippets"
  add_foreign_key "snippet_comments", "users"
  add_foreign_key "snippet_likes", "snippets"
  add_foreign_key "snippet_likes", "users"
  add_foreign_key "snippet_tags", "snippets"
  add_foreign_key "snippet_tags", "tags"
  add_foreign_key "snippets", "boards"
end
