# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170522060748) do

  create_table "hops", force: :cascade do |t|
    t.integer  "recipe_id"
    t.string   "use"
    t.string   "origin"
    t.float    "aa"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "name"
    t.decimal  "quantity"
  end

  create_table "malts", force: :cascade do |t|
    t.integer  "recipe_id"
    t.string   "malt_type"
    t.string   "use"
    t.float    "EBC"
    t.float    "ppg"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "name"
    t.decimal  "quantity"
  end

  create_table "ratings", force: :cascade do |t|
    t.integer "recipe_id"
    t.integer "user_id"
    t.decimal "rating"
  end

  create_table "recipes", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "method"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "style"
  end

  create_table "stock_items", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "ingredient_id"
    t.float    "quantity"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "password_digest"
    t.string   "location"
    t.string   "remember_digest"
    t.string   "activation_digest"
    t.boolean  "activated",         default: false
    t.datetime "activated_at"
    t.string   "reset_digest"
    t.datetime "reset_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "yeasts", force: :cascade do |t|
    t.integer  "recipe_id"
    t.string   "fermentation_type"
    t.string   "temp_range"
    t.text     "description"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "name"
  end

end
