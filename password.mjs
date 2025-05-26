import inquirer from 'inquirer';
import bcrypt from 'bcrypt';

// Sample user data with hashed passwords
// Note: In a real application, you would not hard-code passwords like this.
// This data would typically come from a database or a secure configuration file.
const users = new Map([
  ['j.murphy93', '$2b$10$cCAygryK/a0c9au0uSlEXu/YQk0TG0Al2DnPUDsoASqs0cFNR69J.'],
  ['katrina.lee', '$2b$10$I2Hkr9RbNh5N0W1cLcAPQu35UHc8zXqhOnrky7YAZACXRveAxYiPu'],
  ['aj_singh', '$2b$10$l/NYub7coe.dmeQBpjbBcueRLUzcvRqkP54bDM2CdwLAoI6ASj6d.'],
  ['emily.chan87', '$2b$10$/XK/qxCQKeT4ZJQtf9SUOO.0hEwSVykOI3NBqlImDnJpREWoJNGSW'],
  ['nathan.b_', '$2b$10$SPihsQB5ksaeMqnptrrL1u3BeD.g5tzuN0SqCdqryaeiI1RXB/qJ2'],
  ['marcus.taylor', '$2b$10$Cuij2RIF3mRr30cNgTzbHutPanmnp7O5Rk5m68dn4fpYxoeESlwie'],
  ['sasha_kim', '$2b$10$3sTcZABNxhtBZAYBtoLHHePV4G9dffMnNfpfZvFHzP0hqMBf.VX0i'],
  ['devon.ramirez', '$2b$10$TsXGi2pKpQCK5gg6ozrlGOSbIg1wNL7Pkoxkj31kvY.LgQYbq.WeO'],
  ['amy.wong', '$2b$10$7sweew8RQn3sDb/a9JQ1HedaY1n9LIRl/Eky5n85OI1tMG03Q2T1u'],
  ['liam.evans', '$2b$10$XRDui/kjKYdMDLk8pE.EF.9nsxR.8nM4/uCqkJRY4H7mgK3XQR.Se'],
  ['hannah.moore', '$2b$10$tcIUnAD6fOLWoi.9iFP5reZEvYtiobTNsBdvNzHGtxbUqAzCFhlOy'],
  ['b_ortega', '$2b$10$lHGSowx8xP7pa5nYMSM0VOySDPOFcxsRqXpwlwErksKJ10KcFGzBq'],
  ['isabelle.j', '$2b$10$ptol04cJbz9R.FgVpiYrKePhMtcnR5u426qtcQd5dM1NVNtqGprC6'],
  ['tyrone_w', '$2b$10$pcEPLq8PEmYpm.E4zmKQ6.cwweJRuqUUuPCKSB4m1D39NTUKmGdji'],
  ['chloe.nguyen', '$2b$10$W8GmX3mo0SNqS2gipONCRO3rSk9CxEuIgNN3t3fwHSIvpnFU5LDt6'],
  ['erik.jensen', '$2b$10$3SGU866bbQqrKhz4XVdJ7uj2E37Lx0HLZqU5KsyPhIhZbmK.BgBrK'],
  ['laura_park', '$2b$10$9auwRL/zhJiAcPG5cOx3s.bho9DCbum8mdFIQJABhUELwRHtbl7vm'],
  ['mike.davis88', '$2b$10$jjYeVAv7bxWaTY88VJAQr.Eoeu0Pb/vSwsE6vWGA4r9Ild.d/Sk0q'],
  ['noah_scott', '$2b$10$4NzNB9tCkBXpo5dyjPeDVu2JHWjZ8KFx2apQ7HOfM.mWCRCRZCNeG'],
  ['amber.j_', '$2b$10$LDGqxPlM3Pcte9rinunNCuFTjK5cm030VnLyFGLBJcRA6pUaQacGi'],
  ['victor_l', '$2b$10$WzO0IMmLuBf2zGQp8gmotuzxVcP.LL/sB8aQgYFNJlUbXbUjLtbfC'],
  ['diana.h', '$2b$10$xwfGUIDwODfBZjWd6VEABuYi7Q6gDWu..tWKc1Li3k4CmeojLdIfK'],
  ['trent.p', '$2b$10$TmeUswfHzuZ.ZCtKnL7hNuOgdqRkWRXEgWNEUFCi6cA7.EVeoet9S'],
  ['serena.cho', '$2b$10$98o3vFkENzIO5o0RUURsxe7HP1DGVOHK4xI.3URMWo9uf5m3/CObW'],
  ['ryan.woods', '$2b$10$CUd/mL4ZwtodiRdL3Nvtz.69cXStsB/PDn5PWXFt55Ey09EpBMeKm'],
  ['julie_chen', '$2b$10$G6lc2Yskon0xAqvbz7K3F.Z4XJSc/0e0myLZT/Yru5e9TIxfaL6ru'],
  ['felix.kim', '$2b$10$jpQKELsGkADylMPagCl6luPv.o4Q2b8fgxkQhtmkvcgRkDBcP0/I2'],
  ['tina.morris', '$2b$10$qsUxWwER/ErW0gYkQIPf5OB1OvWYi/nx30ba.0WEYas3ForYOZVUS'],
  ['blake_m', '$2b$10$SOrKYvlbVcgtkDcSIwTkx.S.OV.9huTlCdjpfz7oiNA6k.lzG8a.G'],
  ['sophia.r', '$2b$10$OVov6.bfXGx2oqD4raxsH.T.SanreugGtPN.IQTkeoYemWPNz8WAW'],
  ['henry_cole', '$2b$10$on8PtiN2G2OVrV8gCbBVAeU347xRCNl7TrbqmCbTsPDGkH3Vt3pE2'],
  ['jamie_s', '$2b$10$ewuzKOu2avOs3iRlhTQ4uu8HbNjnblyihG0h4BMZV0edTU97gdmx6'],
  ['megan_hunt', '$2b$10$eTw5Q9TDqRVA.GbmiCN4QOy3nmfwcKNyEwJsPkiVL/SsOXszq411a'],
  ['leo.grant', '$2b$10$m2ylMh9RNPE.KUCvYQF.PeS0Wh7jjT6p8W22.5mG9nWDUcwc2f/iO'],
  ['danielle.m', '$2b$10$J2dpPHmeU3jnFRDh7D4Hy.MYcDDHnrwBfXPEIMi/gt9BwSQmqa5v6'],
  ['trevor.y', '$2b$10$RABSnBMbcQWoAS4WLqbB9.hX.kxmH61OnDfDM9zvWr/cspAAUWCuq'],
  ['kayla_b', '$2b$10$j8sAIyChXZlkPSmeZ4so3eWQX/v0DhWDvqr8fpR7Rc9WTaw29v2e2'],
  ['cody.m', '$2b$10$QaNTZfxBEC/SeQZpQr8TnOciJ5CRWmCxUdqXszXzY5YtJHAZKbohi'],
  ['andrea.ross', '$2b$10$bxxH7WmfBNVohMsoOiufweWkmOcZyBKxh4mYW3b7Mcq5MZ94of74K'],
  ['zach_h', '$2b$10$dXoMWk8WxQUSXFwMCMo0lOv3Bq1qt1r6klkQ4eYfleCPC4I7EAKhS'],
  ['camila.f', '$2b$10$i3nra2KYQorQHtfyf9q7VOzAgO9IO9i3ySSdGo4BgWSd1A3/I05xm'],
  ['ethan_b', '$2b$10$i1jOrHoKcrAjhAZE7HODb.Y.bdOSFStAiPuorxq4KwkmJXWUUSoiK'],
  ['ava.j', '$2b$10$G5juqid4MBHSTvrcRP5BJe3SDRdK7NRT9MUfr1WewrmDn7J7dgK9G'],
  ['julian.k', '$2b$10$XvJ3ioPor838pAXMnItJZ.nYDxyTbiG4g2AashTAfmjBqvd5lwHyq'],
  ['grace_choi', '$2b$10$XjIF0VZK/btp6IjPtmmv8uW6RwQRsMnkaiMPxX3G6j3hFuGyWN/qW'],
  ['owen.tan', '$2b$10$LjL1iHcEPvUJvakSctQBZeakJO464RcLWS2QTE2VgznJoV9zcb1tu'],
  ['nina_s', '$2b$10$rp6Nu9iYvIxvzoy/jngOhug4fpfCJ4xiy/abKq7c/uegPs2ce8YC6'],
  ['jared.l', '$2b$10$xn2A0RiGy/0FLBET.1gBxe3Owwbw56t4Kz/OIhvIXDbxtOLsOZI2m'],
  ['lily.a', '$2b$10$mMdWVVsxc8knG0ea4f7hC.mZ1C3yq3uk1orPmdExEuEzwaZ4ae0ya'],
  ['harper.m', '$2b$10$roGaPIAbSTjyrTK00KcfqeehZ6RdaPT7kbazR4FX7mgZM6srHq.LK'],
  ['lucas.d', '$2b$10$3Mwc8uRygPpKvJ1MSm3yc.nWYBNmgs2ug2Y4eqVidzFgnqSUL4m6i'],
  ['zoe_h', '$2b$10$KpQ5NegkOw1AU4NNGdp7gOVlbBDHC1xFpVggBsUgBmgqDQrNYs4mW'],
  ['colton.g', '$2b$10$eKKcGrAOGLmFAvyOnp4zNuu29mLMv3ny6ivyUyYdYM4nWZwhZr8jS'],
  ['melanie_r', '$2b$10$Mht08gzz8D1.q8lULZd9Ie7VUHZMJmrE8yh0ME/OxCNzkJ0DDIVoC'],
  ['aiden.c', '$2b$10$knUdzd448TrRxX7.Dja1ReYD3f177JZX22slRGR6m1CQvNT8sRCHq'],
  ['kelsey.v', '$2b$10$s87Jq2BVUr8DsEd7RgAeauoa7DgfdPQDeyq25tnDSP/UZAwRLluKu'],
  ['brian_xu', '$2b$10$I2.xKJC9u6OPI8.KUJqOSefwsJkKLYbOqXQWV8t32HHLY.UW9uzcK'],
  ['rebecca.t', '$2b$10$d6gu3.mhItI.sIk5VM7CPO2tr4/NMo0vfZIhiWs2gtF6vbmC1d1ly'],
  ['eli.p', '$2b$10$z0gQsN9teJolGmXOs1PRG.afsP2rX.pivWtYzig9nHQq0QEMpAw32'],
  ['madison.f', '$2b$10$I9mjhHH6sh4UUwCyC73IDepsSZz6pV787VHSt/aAhqyst/L8T1Kei'],
  ['hunter.k', '$2b$10$8nIZR/WxB7ZtKepOVQgnfuutOieSzjh3.E0BDNCNvucLru/uS5foS'],
  ['vanessa.c', '$2b$10$WXOsOkFN9snSyk4vG2VdP./1Svoklqg7hTeomlJyt14sSQqfQefI6'],
  ['josh.y', '$2b$10$hNLiIwByxZg83XJdsRwy7.j6MlC7V05XQmf7cwz8JGvErLwDwAmTS'],
  ['carla_m', '$2b$10$Ly1WmRWWt6IgoGSi0PbbX.6VuD70YwuxWkuAo6HIPlL2Uith.bJxS'],
  ['adrian.n', '$2b$10$IY7I3Xem0XwPi2DCjM6RqeuVOBYo.Qc/siki0jGWYYiBgDlm46z02'],
  ['brittany.g', '$2b$10$2MUJ38.N3LbGxTQWBs3DZO/jzlfzJ9USGibshwiaqexts8ruxmuBy'],
  ['dylan_ho', '$2b$10$4JaKLMRsk597mfub5gX8COU1EWfoeCuxY5qHQokKTJ4qWpxdC9Kbe'],
  ['alina_v', '$2b$10$7I3AR5zpbLwDPeRgOlwTUePNnZRbXuoqdcdmDBVyq.AaTR.qDs.Ce'],
  ['kevin_park', '$2b$10$CuekNUuEGwnTpWEk.qvRf.hIm1VvLZzebMAX83g88338eZfJZA9Ve'],
  ['stella_m', '$2b$10$xnNsa6f3185C8MbMSDdEJuB4OC/m9XuSeld1POet2Vt8Cbp2GmWHe'],
  ['mason.l', '$2b$10$L0YT2FY/CyNazJzK0j43duLQ4b3PwjMuNO0qSjoIkk.nWloBun3VK'],
  ['natalie.r', '$2b$10$Qu.sqwSgsQDV40hb25sDvOvOtjCNu2h8ckHeMSHYNLH7Xb9i8nei.'],
  ['brandon.j', '$2b$10$QtXw/JpbnOcKGlwAkZzZH.tbfvIRjATgmevNt8tpm22FFAhLkSaIG'],
  ['julia_fox', '$2b$10$04OWVVGh8CrxNi4ewJ.DYepvohobNAH1qqyx1xtkGHsdGt..YPrP6'],
  ['connor.b', '$2b$10$pRd0RGzNwp1jFCbMmI/X5.BEOyldNHq2BHZKsBr0GPAsgdph9t31e'],
  ['amelia.k', '$2b$10$QeQI0qt4Nte8OQ0rymo6M.LVbV0Rf4L1PDY2GJiPQtNzDIjt2rOre'],
  ['sean.t', '$2b$10$uAgY3sJJrfpQtVuUtYxaRezrDeU/p1Qq3tsOp3CIXfwEuHiqTmCoe'],
  ['iris.h', '$2b$10$nvG75Tq3RoMNnp1pf84I2.CoLfPSDs1BRn1a5PbtwKq8nLLUM2jXy'],
  ['caleb.n', '$2b$10$XG3WjG3LuUc.dQyTEf22cuz.YfWqxtZpOFEXj0tOu35aXbuRtE1V.'],
  ['paige_y', '$2b$10$NecPWuEyTiz0UOxt1hsxxOMEFEyhgGtTnuW59quGlaD6yVp/trxKG'],
  ['elijah.m', '$2b$10$UuH8u4.ieL8OwlZ8vGn6uu7AeWxA4Pcu0bKNeQFnEvhwb4/TT2hr2'],
  ['carmen.r', '$2b$10$2hBgep1zcOZMdKnlU/8iXO0bn5aGtqW3brvMyuRifmj6yXZgKdnLS'],
  ['gabe_z', '$2b$10$d6tNrieCH.vJkGKED0jiLeCbDsnfOpKxZqslvoZZ5IVhrtLPKieYC'],
  ['tiffany.x', '$2b$10$UenE1y73pwipRU1kIjvbeOB.oZpsDVevTitSxkom5TelQB3PwoEhq'],
  ['reece.k', '$2b$10$41OV6KRjKKN.vpDfLxSJb.v9iCGL.I5P1Jm7FsesvTfXfJfpSUQSu'],
  ['bianca.d', '$2b$10$qKj/iybYQsC0psA6Gk0LTOYXvWbp6UtwcrIXLkelDkUNqPe.1JO8m'],
  ['landon_w', '$2b$10$p3ckasHvUw.QKUNvI3V/RemkArwRlRFW3ZJI2lnhF0Xi2s.mFIC8i'],
  ['faith.j', '$2b$10$jvjL7v5B9Jx8nDd0Etv0ouHOyjASWEVsZ1as4gRxeUd6QVzGQuEtC'],
  ['carter_s', '$2b$10$edzz353qWws4p7vfgnkbN.aWfxsvPlbrlJ72YsF93WFmlvFqvzvz2'],
  ['daisy_t', '$2b$10$y6l8L9g7AJqrrs42BkoTTOdoRi3NoBXifgBq2vGuVe1XxKjvFKtQS'],
  ['isaac.f', '$2b$10$9OCJy1PkIult/FNoEpoBceGV6Aj2cYARwDbRAaNUO2WXfGFFQRUMK'],
  ['elena.m', '$2b$10$mbxV4zG92B5EZxcpkMDFXOKi.fVUtiW2FvJofowSFShWuZy0xJVW.'],
  ['chris.o', '$2b$10$QqDwaInzfHV67jwccm.kVufCdyZrP/JFoU9bToVEXpIsywkmCAa7K'],
  ['heidi_b', '$2b$10$JzBVYjTnYV.cjovfhYT5je9TgxcdJA4VQ8DKL2Jddz1YvYsMrNqSi'],
  ['tristan.m', '$2b$10$q.q4BHCz3RXjzv.zXl49f.hcvJUzJdSJmYISkhSSQzvLF7kY7yi3y'],
  ['leila.c', '$2b$10$KPIexU7j4AVpd9fySImeTOwSgOzoJ5JNTuQCB0oNV0kKaQDMvwW/u'],
  ['miles.j', '$2b$10$0F5RLLfTOJM0MqzTiYtih.fwPx9cm7qcOC7hLowNQjo3K2s644gE.'],
  ['cynthia_v', '$2b$10$lNPUmj25x25S5c8YMMrPsOv5u9nWKqwCs6R4.6ctvuMQ2qTNiLRqO'],
  ['ray_k', '$2b$10$frM7LjnKPcJcup.uXZwkgOKZEUTcPob0x38awI8wl6vZxKNFztJJ.'],
  ['sydney.h', '$2b$10$e0cZ58JiqkADyC3ObuEsGOpo2dlzidBp6LVp3ZLVvAYIjCJMD7vKm']
]);

// Asynchronous function to prompt user for login credentials
async function login() {
  // Use inquirer to ask for username and password
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'username',
    message: 'What is your username? '
  },
  {
    type: 'password', // Password input type (masks characters)
    name: 'password',
    message: 'What is your password? ',
    mask: '*' // Character to display for masked input
  }]);
  return answers; // Return the collected username and password
}

// Call the login function and wait for the user's input
const answers = await login();

// Extract username and password from the answers object
const username = answers.username;
const password = answers.password;

  // Check if the entered username exists in our 'users' Map
  if (users.has(username)) {
    // If username exists, retrieve the stored hashed password
    const hashPassword = users.get(username);
    // Compare the entered password with the stored hash using bcrypt
    // 'await' is crucial here as bcrypt.compare is asynchronous
    const isMatch = await bcrypt.compare(password, hashPassword);

    // If the passwords match
    if (isMatch) {
      console.log('Login successful!');
    } else {
      // If passwords do not match
      console.log('Incorrect password.');
    }
  } else {
    // If the username is not found in the 'users' Map
    console.log('User not found.');
  }
