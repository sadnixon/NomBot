'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const _ = require('lodash');

const data = new SlashCommandBuilder()
  .setName('vote')
  .setDescription('Vote for a player to be eliminated')
  .addUserOption((option) =>
    option
      .setName('target')
      .setDescription('The player who you want to be eliminated')
      .setRequired(true),
  );

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });

  const nomsOpen = await gameInfo.get('nomsOpen');
  const gameState = await gameInfo.get('gameState');
  const targetUser = interaction.options.getUser(`target`).id;

  if (!nomsOpen || !gameState.noms.map((e) => e.target).includes(targetUser)) {
    return interaction.editReply({
      content: `You can't do this vote!`,
      ephemeral: true,
    });
  }

  const nomIndex = gameState.noms.map((e) => e.target).indexOf(targetUser);

  if (gameState.noms[nomIndex].voters.includes(interaction.user.id)) {
    return interaction.editReply({
      content: `You already made this vote!`,
      ephemeral: true,
    });
  }

  gameState.noms[nomIndex].voters.push(interaction.user.id);

  await gameInfo.set('gameState', gameState);

  await interaction.editReply({
    content: `Your vote went through!`,
    ephemeral: true,
  });
}

module.exports = {
  data,
  execute,
};
