module.exports = {
  fake_users: [
    { id: 1, game_nick: 'game-nick-1', nick: 'nick-1', frequency_rating: 6, friendly_rating: 8 },
    { id: 2, game_nick: 'game-nick-2', nick: 'nick-2', frequency_rating: 6, friendly_rating: 9 },
    { id: 3, game_nick: 'game-nick-3', nick: 'nick-3', frequency_rating: 7, friendly_rating: 7 },
    { id: 4, game_nick: 'game-nick-4', nick: 'nick-4', frequency_rating: 7, friendly_rating: 7 },
    { id: 5, game_nick: 'game-nick-5', nick: 'nick-5', frequency_rating: 3, friendly_rating: 9 },
    { id: 6, game_nick: '', nick: 'nick-6', desired_group_size: 7, desired_interaction_frequency: 2 },
    { id: 7, game_nick: 'game-nick-7', nick: '', desired_group_size: 7, desired_interaction_frequency: 2 },
    { id: 8, game_nick: 'game-nick-8', nick: 'nick-8', desired_group_size: 10, desired_interaction_frequency: 1 },
    { id: 9, game_nick: 'to be deleted', nick: 'nick-9' },
    { id: 10, game_nick: 'to be updated', nick: 'nick-10' },
  ],
  create_user_id: 666,
  update_user: {
    id: 10,
    game_nick: 'cuquito33',
    nick: 'the best nick ever',
    desired_group_size: 10,
    desired_interaction_frequency: 2,
  },
  delete_user_id: 9,
  desired_searchs: [
    { desired_group_size: 7, desired_interaction_frequency: 2 },
    { desired_group_size: 10, desired_interaction_frequency: 1 },
  ],
  rating_searchs: [
    { frequency_rating: 7 },
    { friendly_rating: 9 },
    { frequency_rating: 7, friendly_rating: 1 },
  ],
}
