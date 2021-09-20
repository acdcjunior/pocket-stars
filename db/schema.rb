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

ActiveRecord::Schema.define(version: 2021_09_20_132514) do

  # original collation below was 'utf8mb4_0900_ai_ci', but we have to change it to utf8mb4_unicode_ci due to ClearDB@Heroku
  # otherwise `$ heroku run 'rake db:setup'` throws `Mysql2::Error: Unknown collation: 'utf8mb4_0900_ai_ci'`
  create_table "products", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.text "slug"
    t.text "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_products_on_name", unique: true, length: 300
    t.index ["slug"], name: "index_products_on_slug", unique: true, length: 300
  end

  # original collation below was 'utf8mb4_0900_ai_ci', but we have to change it to utf8mb4_unicode_ci due to ClearDB@Heroku
  # otherwise `$ heroku run 'rake db:setup'` throws `Mysql2::Error: Unknown collation: 'utf8mb4_0900_ai_ci'`
  create_table "reviews", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "rating"
    t.text "review"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "half_star"
  end

end
