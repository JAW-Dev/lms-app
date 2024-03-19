# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require_relative 'services/country_seed_service'

if Rails.env.development?
  admin = User.find_or_create_by(email: "admin@carney.co")
  admin.password = "admin#123"
  admin.profile ||= Profile.new(first_name: "Admin", last_name: "User")
  admin.skip_confirmation!
  admin.save
  admin.add_role :manager
  admin.add_role :admin

  manager = User.find_or_create_by(email: "manager@carney.co")
  manager.password = "manager#123"
  manager.profile ||= Profile.new(first_name: "Manager", last_name: "User")
  manager.skip_confirmation!
  manager.save
  manager.add_role :manager

  user = User.find_or_create_by(email: "user@carney.co")
  user.password = "user#123"
  user.profile ||= Profile.new(first_name: "Regular", last_name: "User")
  user.skip_confirmation!
  user.save

  courses = [
    {
      title: 'Making People Better Through Feedback',
      sku: 'MOD0001'
    },
    {
      title: 'Why Should Anyone Follow You',
      sku: 'MOD0002'
    },
    {
      title: 'Making the Time to Lead',
      sku: 'MOD0003'
    },
    {
      title: 'Lasting Personal Change',
      sku: 'MOD0004'
    },
    {
      title: 'Forging a Team of Leaders',
      sku: 'MOD0005'
    },
    {
      title: 'The Secret to Inspiring Others',
      sku: 'MOD0006'
    },
    {
      title: 'Elevating Performance and Holding Others Accountable',
      sku: 'MOD0007'
    },
    {
      title: 'Making Great Decisions',
      sku: 'MOD0008'
    },
    {
      title: 'What the Best Leaders Know About Relationships',
      sku: 'MOD0009'
    },
    {
      title: 'Propelling Change',
      sku: 'MOD0010'
    }
  ]

  courses.each do |course_data|
    course = Curriculum::Course.find_or_create_by(sku: course_data[:sku])
    course.title = course_data[:title]
    course.enabled = true
    course.price = 100
    course.save
  end

  behaviors = [
    {
      course: 'MOD0001',
      videos: [
        {
          title: 'Go Forward with Feedback',
          sku: 'BEH0001'
        },
        {
          title: 'Be a More of – Less of Leader',
          sku: 'BEH0002'
        },
        {
          title: 'Get Others to Talk First',
          sku: 'BEH0003'
        },
        {
          title: 'Strike a Balance When Giving Feedback',
          sku: 'BEH0004'
        },
        {
          title: 'The Magic of How Questions',
          sku: 'BEH0005'
        },
        {
          title: 'Make It About You First',
          sku: 'BEH0006'
        },
        {
          title: 'Big Picture, Small Correction, Big Picture',
          sku: 'BEH0007'
        },
        {
          title: 'Avoid Feedback During Performance',
          sku: 'BEH0008'
        },
        {
          title: 'Sometimes Feedback Needs to Echo',
          sku: 'BEH0009'
        },
        {
          title: 'Throw Problems Back',
          sku: 'BEH0010'
        }
      ]
    },
    {
      course: 'MOD0002',
      videos: [
        {
          title: 'I’m Not Above What I Ask You to Do',
          sku: 'BEH0011'
        },
        {
          title: 'Treat the Unimportant Importantly',
          sku: 'BEH0012'
        },
        {
          title: 'No One Gets Humiliated, Embarrassed or Ridiculed on Your Watch',
          sku: 'BEH0013'
        },
        {
          title: 'Allow Others to Exclusively Own Your Full Attention',
          sku: 'BEH0014'
        },
        {
          title: 'Expand Credit to Those Behind the Scenes',
          sku: 'BEH0015'
        },
        {
          title: 'Express Credibility by Understanding Constraints',
          sku: 'BEH0016'
        },
        {
          title: 'Elevate What Matters, Especially After Success and Failure',
          sku: 'BEH0017'
        },
        {
          title: 'Who Knows Who Knows is the Real Expert',
          sku: 'BEH0018'
        },
        {
          title: 'Insist on Recognizing Excellence Wherever You Find It',
          sku: 'BEH0019'
        },
        {
          title: 'The Credit is Yours, The Blame is Mine is Your Operating Principle',
          sku: 'BEH0020'
        }
      ]
    },
    {
      course: 'MOD0003',
      videos: [
        {
          title: 'Make Incremental Progress on Your Biggest Priorities Every Day',
          sku: 'BEH0021'
        },
        {
          title: 'Your Tracking List is More Important Than Your To-Do List',
          sku: 'BEH0022'
        },
        {
          title: 'Unproductive Time Might Be Your Most Productive Time',
          sku: 'BEH0023'
        },
        {
          title: 'Work in Uninterrupted Chunks of Time',
          sku: 'BEH0024'
        },
        {
          title: 'Shackle Technology by Creating Your Own Rules',
          sku: 'BEH0025'
        },
        {
          title: 'Pre-Commit All of Your Calendar',
          sku: 'BEH0026'
        },
        {
          title: 'Alter-Task to Keep Your Mind Fresh',
          sku: 'BEH0027'
        },
        {
          title: 'Learn to Ignore Tasks and Leave Things Undone',
          sku: 'BEH0028'
        },
        {
          title: 'Manage Energy with White Space',
          sku: 'BEH0029'
        },
        {
          title: 'Speed Others Up',
          sku: 'BEH0030'
        }        
      ]
    },
    {
      course: 'MOD0004',
      videos: [
        {
          title: 'This is the Leader I Want to Be',
          sku: 'BEH0031'
        },
        {
          title: 'High Repetition Rewires Your Brain',
          sku: 'BEH0032'
        },
        {
          title: 'You Have to Name It To Make It Your Own',
          sku: 'BEH0033'
        },
        {
          title: 'Keep Streaks Alive',
          sku: 'BEH0034'
        },
        {
          title: 'Create an Environment That Makes Change Possible',
          sku: 'BEH0035'
        },
        {
          title: 'Journal Your Progress to Spur More Progress',
          sku: 'BEH0036'
        },
        {
          title: 'Watch Yourself in Action',
          sku: 'BEH0037'
        },
        {
          title: 'Ask a Friend for Their Eyes and Ears',
          sku: 'BEH0038'
        },
        {
          title: 'Pair New Behaviors with Established Behaviors',
          sku: 'BEH0039'
        },
        {
          title: 'Wisdom is All About the Review',
          sku: 'BEH0040'
        }
      ]
    },
    {
      course: 'MOD0005',
      videos: [
        {
          title: 'Express Team Values Every Day',
          sku: 'BEH0041'
        },
        {
          title: 'Shared Learning Creates Trust',
          sku: 'BEH0042'
        },
        {
          title: 'Cultivate Conversations of Inquiry and Dialogue',
          sku: 'BEH0043'
        },
        {
          title: 'Team Success Away from the Work Creates a Winning Attitude',
          sku: 'BEH0044'
        },
        {
          title: 'Instant Accountability Fosters Mutual Respect',
          sku: 'BEH0045'
        },
        {
          title: 'Everyone Lives by the Same Rules',
          sku: 'BEH0046'
        },
        {
          title: 'A Great Team Never Waits for the Team Leader',
          sku: 'BEH0047'
        },
        {
          title: 'Embrace Conflict as a Sign of Team Strength',
          sku: 'BEH0048'
        },
        {
          title: 'Create Safety So Others Will Take Risks',
          sku: 'BEH0049'
        },
        {
          title: 'Deep Understanding Builds Relational Closeness',
          sku: 'BEH0050'
        }
      ]
    },
    {
      course: 'MOD0006',
      videos: [
        {
          title: 'Underline Strengths Prior to Performance',
          sku: 'BEH0051'
        },
        {
          title: 'Give Great Accomplishments a Long Shelf Life',
          sku: 'BEH0052'
        },
        {
          title: 'Make Others Look Good to People They Care Most About',
          sku: 'BEH0053'
        },
        {
          title: 'Reward People with Special Experiences',
          sku: 'BEH0054'
        },
        {
          title: 'Ask to Watch Others Success',
          sku: 'BEH0055'
        },
        {
          title: 'You’ve Influenced Me',
          sku: 'BEH0056'
        },
        {
          title: 'Third Party Compliments Carry the Most Weight',
          sku: 'BEH0057'
        },
        {
          title: 'Project Future Success',
          sku: 'BEH0058'
        },
        {
          title: 'Your Opinion is My Opinion',
          sku: 'BEH0059'
        },
        {
          title: 'Become a Master of Spontaneous Rewards',
          sku: 'BEH0060'
        }
      ]
    },
    {
      course: 'MOD0007',
      videos: [
        {
          title: 'The Best Leaders Actually Hold People Accountable with a Simple Question',
          sku: 'BEH0061'
        },
        {
          title: 'Confront Poor Performance with a Request for Information',
          sku: 'BEH0062'
        },
        {
          title: 'Offer Special Facts to Keep People on Their Toes',
          sku: 'BEH0063'
        },
        {
          title: 'Calibrate Short-Term Priorities to Drive Short-term Results',
          sku: 'BEH0064'
        },
        {
          title: 'Peer Evaluation is the Judgment that Matters Most',
          sku: 'BEH0065'
        },
        {
          title: 'Always Make Practice Harder than the Performance',
          sku: 'BEH0066'
        },
        {
          title: 'What Is Your Flight Simulator (Training that Builds Repetition)?',
          sku: 'BEH0067'
        },
        {
          title: 'Collect Models to Jump-Start Learning',
          sku: 'BEH0068'
        },
        {
          title: 'Teach the Sub-Skills',
          sku: 'BEH0069'
        },
        {
          title: 'Immediately Teach Someone Else When You Learn Something New',
          sku: 'BEH0070'
        }
      ]
    },
    {
      course: 'MOD0008',
      videos: [
        {
          title: 'Every Decision Creates Its Own Problems',
          sku: 'BEH0071'
        },
        {
          title: 'How We Define a Problem Dictates the Solutions',
          sku: 'BEH0072'
        },
        {
          title: 'Checklist Questions Remind Us to Make Quality Decisions',
          sku: 'BEH0073'
        },
        {
          title: 'Make Decisions as Soon or as Late as You Can',
          sku: 'BEH0074'
        },
        {
          title: 'Use the Process of Weigh-In Consensus Making for Major Decisions',
          sku: 'BEH0075'
        },
        {
          title: 'Live Decisions Before You Make Them',
          sku: 'BEH0076'
        },
        {
          title: 'Communicate as Loudly About Status Quo Decisions',
          sku: 'BEH0077'
        },
        {
          title: 'Push Down a Superseding Value to Improve Decisions',
          sku: 'BEH0078'
        },
        {
          title: 'Decision Fatigue is Real, So Deal with It',
          sku: 'BEH0079'
        },
        {
          title: 'Celebrate Decisions Not Outcomes',
          sku: 'BEH0080'
        }
      ]
    },
    {
      course: 'MOD0009',
      videos: [
        {
          title: 'Adding Value in Relationships Matters Most',
          sku: 'BEH0081'
        },
        {
          title: 'Frequency, Not Quality, Deepens Relationships Most',
          sku: 'BEH0082'
        },
        {
          title: 'Keeping Conversations Alive is the Prime Directive',
          sku: 'BEH0083'
        },
        {
          title: 'Plan for the Next Conversation in This Conversation',
          sku: 'BEH0084'
        },
        {
          title: 'Congratulate People You Don’t Really Know',
          sku: 'BEH0085'
        },
        {
          title: 'Thankfulness Begins with Endings',
          sku: 'BEH0086'
        },
        {
          title: 'Peers Must Respect Territory',
          sku: 'BEH0087'
        },
        {
          title: 'Fast Transitions Make for Better Relationships',
          sku: 'BEH0088'
        },
        {
          title: 'Disagreeing Agreeably is the Most Important Relationship Skill',
          sku: 'BEH0089'
        },
        {
          title: 'Learn to Confront Others Over Values and Not Incidents',
          sku: 'BEH0090'
        }
      ]
    },
    {
      course: 'MOD0010',
      videos: [
        {
          title: 'Repetition Not Advocacy Creates New Norms',
          sku: 'BEH0091'
        },
        {
          title: 'Allow Behavior to Create Belief',
          sku: 'BEH0092'
        },
        {
          title: 'Expand Boundaries to Make Change Comfortable',
          sku: 'BEH0093'
        },
        {
          title: 'If We Want People to Change We Have to Give Them Some Things That Never Change',
          sku: 'BEH0094'
        },
        {
          title: 'Invest in What Already Works',
          sku: 'BEH0095'
        },
        {
          title: 'Start Small and Scale Fast',
          sku: 'BEH0096'
        },
        {
          title: 'Create Change One Win at a Time',
          sku: 'BEH0097'
        },
        {
          title: 'People Follow the Followers More than Leaders',
          sku: 'BEH0098'
        },
        {
          title: 'Colleagues Who opt Out of Change Reflect Your Commitment',
          sku: 'BEH0099'
        },
        {
          title: 'Sign People Up Before Change Matters',
          sku: 'BEH0100'
        }
      ]
    }
  ]

  behaviors.each do |behavior_data|
    course = Curriculum::Course.find_by_sku(behavior_data[:course])
    course.behaviors = []
    behavior_data[:videos].each do |video_data|
      behavior = Curriculum::Behavior.find_or_create_by(sku: video_data[:sku])
      behavior.title = video_data[:title] if video_data[:title]
      behavior.enabled = true
      behavior.save
      course.behaviors << behavior
    end
  end

  CountrySeedService.add_countries
  CountrySeedService.add_states
end
