'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const _ = require('lodash');

const data = new SlashCommandBuilder()
  .setName('unvote')
  .setDescription('Unvote for a player to be eliminated')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The player you are acting for')
      .setRequired(true),
  )
  .addUserOption((option) =>
    option
      .setName('target')
      .setDescription(`The player who you don't want to be eliminated`)
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
  const targetUser = interaction.options.getUser(`target`).id;

  if (!nomsOpen || !gameState.noms.map((e) => e.target).includes(targetUser)) {
    return interaction.editReply({
      content: `You can't do this unvote!`,
      ephemeral: true,
    });
  }

  const nomIndex = gameState.noms.map((e) => e.target).indexOf(targetUser);

  if (!gameState.noms[nomIndex].voters.includes(userId)) {
    return interaction.editReply({
      content: `You haven't made this vote!`,
      ephemeral: true,
    });
  }

  gameState.noms[nomIndex].voters = gameState.noms[nomIndex].voters.filter(
    (e) => e !== userId,
  );

  await gameInfo.set('gameState', gameState);

  await interaction.editReply({
    content: `Your unvote went through!`,
    ephemeral: true,
  });
}

module.exports = {
  data,
  execute,
};
