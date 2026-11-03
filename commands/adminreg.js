'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('adminreg')
  .setDescription(
    'Register the channel you are in as one of the game comms channels',
  )
  .addStringOption((option) =>
    option
      .setName('channel')
      .setDescription('Game channel')
      .setRequired(true)
      .addChoices({
        name: 'Announcements',
        value: 'announcements',
      }),
  );

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  if (!interaction.guildId) {
    return interaction.editReply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
  }

  const gameChannels = await gameInfo.get('game_channels');
  const channelType = interaction.options.getString('channel');

  gameChannels[channelType] = {
    type: channelType,
    channelId: interaction.channel.id,
  };

  await gameInfo.set('game_channels', gameChannels);

  await interaction.editReply({
    content: `You have now registered this channel as the ${channelType} channel for games!`,
    ephemeral: true,
  });
}

module.exports = {
  data,
  execute,
};
