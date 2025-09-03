import { system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

function showModalForm(player) {
    const form = new ModalFormData();
    form.title("§4Call Airstrike")
        .textField("x", "§6Drop Point X")
        .textField("z", "§6Drop Point Z")
        .dropdown("type", ["Rocket", "Cluster", "Napalm", "MOAB", "General", "Bunker Buster", "White phosphorus", "Sarin", "Nuke(Gravity)", "Nuke(ICBM)"])

        .show(player).then(re => {
            if (re.canceled) {
                return;
            }

            const x = parseFloat(re.formValues[0]);
            const z = parseFloat(re.formValues[1]);

            if (isNaN(x) || isNaN(z)) {
                player.runCommand(`say Its Not available answer.`);
                return;
            }
            const t = (re.formValues[2]);

            if (t === 0) {
                player.runCommand(`summon ais:rocket ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 555);
            } else if (t ===1) {
                player.runCommand(`summon ais:cluster ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 555);
            } else if (t === 2) {
                player.runCommand(`summon ais:napalm ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 555);
            } else if (t === 3) {
                player.runCommand(`summon ais:moab ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 1000);
            } else if (t === 4) {
                player.runCommand(`summon ais:general ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 555);
            } else if (t === 5) {
                player.runCommand(`summon ais:gbu ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 1000);
            } else if (t === 6) {
                player.runCommand(`summon ais:rin ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 555);
            } else if (t === 7) {
                player.runCommand(`summon ais:sarin ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 1000);
            } else if (t === 8) {
                player.runCommand(`summon ais:b61 ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 5555);
            } else if (t === 9) {
                player.runCommand(`summon ais:icbm ${x} 350 ${z}`);
                player.startItemCooldown("onFire", 5555);
            } else {
                player.runCommand(`say @s Unknown error. Please report it to @oisiiramune (Discord). `)
            }
        });
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        "ais:Remocon",
        {
            onUse({ source }) {
                showModalForm(source);
            }
        }
    );
});
