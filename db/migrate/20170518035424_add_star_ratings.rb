class AddStarRatings < ActiveRecord::Migration[5.0]
  def change
    create_table :ratings do |t|
      t.integer :recipe_id
      t.integer :user_id
      t.decimal :rating
    end
  end
end
