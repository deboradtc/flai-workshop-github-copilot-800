from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Delete existing data
        self.stdout.write('Deleting existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earths Mightiest Heroes united for fitness glory'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Legendary heroes competing for ultimate fitness dominance'
        )
        
        # Create Marvel Users
        self.stdout.write('Creating Marvel heroes...')
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'password': 'arc_reactor_2024'},
            {'name': 'Steve Rogers', 'email': 'captainamerica@marvel.com', 'password': 'shield_throw_42'},
            {'name': 'Thor Odinson', 'email': 'thor@asgard.marvel.com', 'password': 'mjolnir_worthy'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'password': 'red_room_elite'},
            {'name': 'Bruce Banner', 'email': 'hulk@marvel.com', 'password': 'gamma_strength'},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'password': 'web_slinger_99'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_marvel.id)
            )
            marvel_users.append(user)
        
        # Create DC Users
        self.stdout.write('Creating DC heroes...')
        dc_heroes = [
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'password': 'dark_knight_rises'},
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'password': 'krypton_power'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'password': 'amazon_warrior'},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'password': 'speed_force_1'},
            {'name': 'Arthur Curry', 'email': 'aquaman@dc.com', 'password': 'atlantis_king'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'password': 'willpower_ring'},
        ]
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_dc.id)
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Weightlifting', 'Cycling', 'Swimming', 'Boxing', 'Yoga', 'HIIT']
        
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 90)
                calories = duration * random.randint(5, 12)
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_id=str(user.id),
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories,
                    date=datetime.now() - timedelta(days=days_ago),
                    notes=f'{activity_type} session by {user.name}'
                )
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in all_users:
            activities = Activity.objects.filter(user_id=str(user.id))
            total_activities = activities.count()
            total_calories = sum(a.calories_burned for a in activities)
            total_duration = sum(a.duration for a in activities)
            
            Leaderboard.objects.create(
                user_id=str(user.id),
                team_id=user.team_id,
                total_activities=total_activities,
                total_calories=total_calories,
                total_duration=total_duration,
                rank=0  # Will be calculated based on sorting
            )
        
        # Update ranks
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_calories')
        for index, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = index
            entry.save()
        
        # Create Workouts
        self.stdout.write('Creating workout plans...')
        workouts = [
            {
                'name': 'Avengers Assemble HIIT',
                'description': 'High-intensity training inspired by Earth\'s Mightiest Heroes',
                'difficulty': 'Advanced',
                'duration': 45,
                'calories_estimate': 500,
                'exercises': [
                    {'name': 'Thor Hammer Swings', 'reps': 20, 'sets': 3},
                    {'name': 'Captain America Shield Throws', 'reps': 15, 'sets': 3},
                    {'name': 'Iron Man Repulsor Blasts', 'reps': 25, 'sets': 3},
                    {'name': 'Black Widow Kicks', 'reps': 30, 'sets': 3},
                ]
            },
            {
                'name': 'Justice League Strength Training',
                'description': 'Build strength worthy of the Justice League',
                'difficulty': 'Advanced',
                'duration': 60,
                'calories_estimate': 600,
                'exercises': [
                    {'name': 'Superman Lifts', 'reps': 10, 'sets': 4},
                    {'name': 'Batman Pull-ups', 'reps': 15, 'sets': 4},
                    {'name': 'Wonder Woman Warrior Squats', 'reps': 20, 'sets': 4},
                    {'name': 'Flash Speed Sprints', 'duration': '30s', 'sets': 5},
                ]
            },
            {
                'name': 'Web-Slinger Cardio',
                'description': 'Spider-Man inspired cardio workout',
                'difficulty': 'Intermediate',
                'duration': 30,
                'calories_estimate': 350,
                'exercises': [
                    {'name': 'Wall Crawl Climbers', 'reps': 20, 'sets': 3},
                    {'name': 'Web Swing Jumps', 'reps': 15, 'sets': 3},
                    {'name': 'Spider Plank', 'duration': '60s', 'sets': 3},
                    {'name': 'Spidey Sense Burpees', 'reps': 12, 'sets': 3},
                ]
            },
            {
                'name': 'Dark Knight Core Routine',
                'description': 'Core workout to build Batman-level strength',
                'difficulty': 'Intermediate',
                'duration': 25,
                'calories_estimate': 250,
                'exercises': [
                    {'name': 'Bat Signal Planks', 'duration': '90s', 'sets': 3},
                    {'name': 'Gotham City Crunches', 'reps': 30, 'sets': 3},
                    {'name': 'Batarang Twists', 'reps': 25, 'sets': 3},
                    {'name': 'Batmobile Russian Twists', 'reps': 40, 'sets': 3},
                ]
            },
            {
                'name': 'Speedster Sprint Session',
                'description': 'Flash-inspired speed and agility training',
                'difficulty': 'Beginner',
                'duration': 20,
                'calories_estimate': 200,
                'exercises': [
                    {'name': 'Lightning Sprints', 'duration': '20s', 'sets': 5},
                    {'name': 'Speed Force High Knees', 'reps': 30, 'sets': 3},
                    {'name': 'Quick Step Shuffles', 'reps': 20, 'sets': 3},
                    {'name': 'Flash Jump Rope', 'duration': '60s', 'sets': 3},
                ]
            },
            {
                'name': 'Asgardian Thunder Workout',
                'description': 'God-level strength training inspired by Thor',
                'difficulty': 'Advanced',
                'duration': 50,
                'calories_estimate': 550,
                'exercises': [
                    {'name': 'Mjolnir Overhead Press', 'reps': 12, 'sets': 4},
                    {'name': 'Thunder God Deadlifts', 'reps': 10, 'sets': 4},
                    {'name': 'Asgardian Battle Rows', 'reps': 15, 'sets': 4},
                    {'name': 'Storm Breaker Swings', 'reps': 20, 'sets': 3},
                ]
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams created: {Team.objects.count()}')
        self.stdout.write(f'Users created: {User.objects.count()}')
        self.stdout.write(f'Activities created: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts created: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('\nDatabase successfully populated with superhero test data!'))
