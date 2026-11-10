'use strict';

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');

const { standardEmbed } = require('../message-helpers');

const data = new SlashCommandBuilder()
  .setName('nomstate')
  .setDescription('Check on how a round of nominations is going');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });

  const gameState = await gameInfo.get('gameState');
  const playerList = await gameInfo.get('playerList');

  if (!gameState.noms) {
    return interaction.editReply({
      content: 'There is nothing to view.',
      ephemeral: true,
    });
  }

  function filterVoters(voterList, referenceList, viewerId, targetId) {
    return voterList;
    return voterList.filter(
      (e) =>
        viewerId === targetId ||
        (referenceList.indexOf(e) > referenceList.indexOf(targetId) &&
          referenceList.indexOf(e) <= referenceList.indexOf(viewerId)) ||
        (referenceList.indexOf(viewerId) < referenceList.indexOf(targetId) &&
          (referenceList.indexOf(e) > referenceList.indexOf(targetId) ||
            referenceList.indexOf(e) <= referenceList.indexOf(viewerId))),
    );
  }

  await interaction.editReply(
    standardEmbed(
      `Current Nominations State`,
      `${gameState.noms
        .map(
          (e) =>
            `**<@${e.id}> Nominates: <@${e.target}>**\n${filterVoters(e.voters, playerList, interaction.user.id, e.target).length} Guilty Voters: ${filterVoters(
              e.voters,
              playerList,
              interaction.user.id,
              e.target,
            )
              .map((f) => `<@${f}>`)
              .join(', ')}`,
        )
        .join('\n\n')}`,
    ),
  );
}

module.exports = {
  data,
  execute,
};
