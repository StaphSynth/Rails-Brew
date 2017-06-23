class AddBoilTimeToHopsTable < ActiveRecord::Migration[5.0]
  def change
    add_column :recipe_hops, :boil_time, :integer
  end
end
