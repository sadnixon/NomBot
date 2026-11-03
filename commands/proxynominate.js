'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const _ = require('lodash');

const data = new SlashCommandBuilder()
  .setName('proxynominate')
  .setDescription('Nominate player to be voted')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The player you are acting for')
      .setRequired(true),
  )
  .addUserOption((option) =>
    option
      .setName('nomination')
      .setDescription('The player who you want to go on the block')
      .setRequired(true),
  );

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  const userId = interaction.options.getUser(`user`).id;

  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  const nomsOpen = await gameInfo.get('nomsOpen');
  const gameState = await gameInfo.get('gameState');
  const targetUser = interaction.options.getUser(`nomination`).id;

  if (
    !nomsOpen ||
    gameState.noms.map((e) => e.id).includes(userId) ||
    gameState.noms.map((e) => e.target).includes(targetUser)
  ) {
    return interaction.editReply({
      content: `You can't do this nomination!`,
      ephemeral: true,
    });
  }

  gameState.noms.push({
    id: userId,
    target: targetUser,
    voters: [userId],
  });

  await gameInfo.set('gameState', gameState);

  const gameChannels = await gameInfo.get('game_channels');
  const announceChannel = await interaction.guild.channels.fetch(
    gameChannels['announcements'].channelId,
  );

  await interaction.editReply({
    content: `Your nomination went through!`,
    ephemeral: true,
  });
  await announceChannel.send(
    `<@${userId}> nominated <@${targetUser}>, making them eligible to be voted with /vote!`,
  );
}

module.exports = {
  data,
  execute,
};
