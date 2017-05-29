class AddUniquenessToRatings < ActiveRecord::Migration[5.0]
  def change
    add_index :ratings, [:user_id, :recipe_id], unique: true
  end
end
