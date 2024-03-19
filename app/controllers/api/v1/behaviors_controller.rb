class Api::V1::BehaviorsController < ApiController
    def create
        @id = behaviors_params[:id]
        behavior = Curriculum::Behavior.find(@id)
        
        render json: {behavior_maps: behavior.behavior_maps, examples: behavior.examples, questions: behavior.questions, exercises: behavior.exercises}, status: :ok
    end

    private

    def behaviors_params
        params.require(:behaviors).permit(:id)
    end
end