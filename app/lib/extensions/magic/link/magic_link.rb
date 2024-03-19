module Extensions
  module Magic
    module Link
      module MagicLink
        def reset_token
          set_sign_in_token(force: true)
        end
      end
    end
  end
end