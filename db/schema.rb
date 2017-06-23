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

ActiveRecord::Schema.define(version: 20170623081721) do

  create_table "ratings", force: :cascade do |t|
    t.integer "recipe_id"
    t.integer "user_id"
    t.decimal "rating"
    t.index ["user_id", "recipe_id"], name: "index_ratings_on_user_id_and_recipe_id", unique: true
  end

  create_table "recipe_adjuncts", force: :cascade do |t|
    t.integer "recipe_id"
    t.string  "adjunct"
  end

  create_table "recipe_hops", force: :cascade do |t|
    t.integer "recipe_id"
    t.string  "hop"
    t.float   "quantity"
    t.integer "boil_time"
  end

  create_table "recipe_malts", force: :cascade do |t|
    t.integer "recipe_id"
    t.string  "malt"
    t.float   "quantity"
  end

  create_table "recipe_yeasts", force: :cascade do |t|
    t.integer "recipe_id"
    t.string  "yeast"
  end

  create_table "recipes", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "method"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.string   "style"
    t.integer  "views",        default: 0
    t.decimal  "batch_volume"
    t.decimal  "OG"
    t.decimal  "FG"
    t.decimal  "colour"
    t.integer  "IBU"
    t.integer  "efficiency"
  end

  create_table "stock_items", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "ingredient_id"
    t.float    "quantity"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "user_preferences", force: :cascade do |t|
    t.integer "user_id"
    t.string  "volume",               limit: 1,                  null: false
    t.string  "temp",                 limit: 1,                  null: false
    t.string  "weight_big",           limit: 1,                  null: false
    t.integer "default_efficiency",             default: 75
    t.decimal "default_batch_volume",           default: "22.0"
    t.string  "weight_small",         limit: 1,                  null: false
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
    t.boolean  "admin",             default: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

end
