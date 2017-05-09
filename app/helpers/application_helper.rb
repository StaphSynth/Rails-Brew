module ApplicationHelper
  def flash_class(level)
    case level
    when "notice"
        return "alert alert-info"
      when "success"
        return "alert alert-success"
      when "error"
        return "alert alert-error"
      when "alert"
        return "alert alert-error"
    end
  end
end
