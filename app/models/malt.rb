class Malt < ApplicationRecord
  belongs_to :recipe

  def partial
    return :malt
  end

  # def self.system
  #  {
  #    myMalt: new(name: "a malt", gravity_per_pound: 1.039, color: "#fff"),
  #  }
  # end
end



# malts =
# {
#   pale_malt: {name: "Pale Malt",EBC: 10,GPP: 1.039},
#   crystal_malt: {name: "Crystal Malt",
#                 EBC: 35,
#                 GPP: 1.042
#               },
# }
