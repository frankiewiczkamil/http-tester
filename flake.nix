{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/24.11";
  };

  outputs =
    { self, nixpkgs }:
    let
      allSystems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-linux"
        "x86_64-darwin"
      ];

      forAllSystems =
        f: nixpkgs.lib.genAttrs allSystems (system: f { pkgs = import nixpkgs { inherit system; }; });
    in
    {
      devShells = forAllSystems (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_22.pkgs.nodejs
            ];
          };
        }
      );
    };
}
