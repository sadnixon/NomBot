'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');

const { standardEmbed } = require('../message-helpers');

const data = new SlashCommandBuilder()
  .setName('adminnomstate')
  .setDescription('Check on how a round of nominations is going');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  const gameState = await gameInfo.get('gameState');
  if (!gameState.noms) {
    return interaction.editReply({
      content: 'There is nothing to view.',
      ephemeral: true,
    });
  }

  await interaction.editReply({
    content: "Here's the current state!",
    ephemeral: true,
  });

  await interaction.channel.send(
    standardEmbed(
      `Current Nominations State`,
      `${gameState.noms.map((e) => `**<@${e.id}> Nominates: <@${e.target}>**\n${e.voters.length} Guilty Voters: ${e.voters.map((f) => `<@${f}>`).join(', ')}`).join('\n\n')}`,
    ),
  );
}

module.exports = {
  data,
  execute,
};
