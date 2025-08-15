scoreboard objectives add nuke dummy
scoreboard objectives add bomb dummy
scoreboard players add @e[type=ais:b61] nuke 1
execute as @e[type=ais:b61,scores={nuke=390..}] at @s run summon ais:nuke
kill @e[scores={nuke=390..}]
scoreboard players add @e[type=ais:nuke] bomb 1

kill @e[scores={bomb=24..}]