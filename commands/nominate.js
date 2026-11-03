'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const _ = require('lodash');

const data = new SlashCommandBuilder()
  .setName('nominate')
  .setDescription('Nominate player to be voted')
  .addUserOption((option) =>
    option
      .setName('nomination')
      .setDescription('The player who you want to go on the block')
      .setRequired(true),
  );

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });

  const nomsOpen = await gameInfo.get('nomsOpen');
  const gameState = await gameInfo.get('gameState');
  const playerList = await gameInfo.get('playerList');
  const targetUser = interaction.options.getUser(`nomination`).id;

  if (
    !nomsOpen ||
    !playerList.includes(interaction.user.id) ||
    !playerList.includes(targetUser) ||
    gameState.noms.map((e) => e.id).includes(interaction.user.id) ||
    gameState.noms.map((e) => e.target).includes(targetUser)
  ) {
    return interaction.editReply({
      content: `You can't do this nomination!`,
      ephemeral: true,
    });
  }

  gameState.noms.push({
    id: interaction.user.id,
    target: targetUser,
    voters: [],
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
    `<@${interaction.user.id}> nominated <@${targetUser}>, making them eligible to be voted with /vote!`,
  );
}

module.exports = {
  data,
  execute,
};
