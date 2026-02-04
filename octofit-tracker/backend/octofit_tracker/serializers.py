from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    team_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'team_id', 'team_name', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_team_name(self, obj):
        """Get the team name for the team_id"""
        if obj.team_id:
            try:
                team = Team.objects.get(id=obj.team_id)
                return team.name
            except Team.DoesNotExist:
                return None
        return None


class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'member_count']
    
    def get_member_count(self, obj):
        """Count the number of users assigned to this team"""
        return User.objects.filter(team_id=str(obj.id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'user_username', 'activity_type', 'duration', 'distance', 'calories_burned', 'date', 'notes']
    
    def get_user_username(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            return user.name
        except User.DoesNotExist:
            return "Unknown User"
    
    def get_distance(self, obj):
        # Calculate estimated distance based on activity type and duration
        # These are rough estimates
        if obj.activity_type == 'Running':
            return round(obj.duration * 0.15, 2)  # ~9 km/h pace
        elif obj.activity_type == 'Cycling':
            return round(obj.duration * 0.33, 2)  # ~20 km/h pace
        elif obj.activity_type == 'Swimming':
            return round(obj.duration * 0.05, 2)  # ~3 km/h pace
        else:
            return 0.0


class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'username', 'team_id', 'team_name', 'total_activities', 'total_calories', 'total_duration', 'total_distance', 'rank']
    
    def get_username(self, obj):
        """Get the username for the user_id"""
        try:
            user = User.objects.get(id=obj.user_id)
            return user.name
        except User.DoesNotExist:
            return "Unknown User"
    
    def get_team_name(self, obj):
        """Get the team name for the team_id"""
        try:
            team = Team.objects.get(id=obj.team_id)
            return team.name
        except Team.DoesNotExist:
            return "No Team"


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'calories_estimate', 'exercises']
