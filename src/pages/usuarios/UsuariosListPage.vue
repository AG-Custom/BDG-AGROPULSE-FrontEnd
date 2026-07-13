<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Usuários"
      subtitulo="Gerencie os usuários com acesso à sua empresa."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo usuário"
        descricao="Cadastrar um novo usuário"
        :to="{ name: 'usuario-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            hint="Nome ou e-mail"
            clearable
            class="usuarios-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <agro-table-skeleton v-if="carregando && usuariosFiltrados.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && usuariosFiltrados.length === 0"
          titulo="Nenhum usuário encontrado"
          :descricao="descricaoVazia"
          icon="group"
        >
          <agro-btn
            v-if="!busca"
            color="primary"
            unelevated
            label="Cadastrar usuário"
            descricao="Ir para o cadastro de usuário"
            :to="{ name: 'usuario-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="usuarios-list__tabela"
          :rows="usuariosFiltrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-nome="props">
            <q-td :props="props">
              {{ nomeCompleto(props.row) }}
            </q-td>
          </template>

          <template #body-cell-perfil="props">
            <q-td :props="props">
              {{ rotuloPerfil(props.row.perfil) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="usuarios-list__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar usuário"
                :to="{ name: 'usuario-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar usuário"
                :to="{ name: 'usuario-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="admin_panel_settings"
                color="primary"
                descricao="Permissões granulares"
                :to="{ name: 'usuario-permissoes', params: { usuarioId: props.row.id } }"
              />
              <agro-btn
                v-if="podeInativar(props.row.status)"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar usuário"
                :loading="inativando"
                @click="inativarUsuario(props.row)"
              />
              <agro-btn
                v-if="props.row.status === UsuarioStatus.Inativo"
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                descricao="Reativar usuário"
                :loading="ativando"
                @click="ativarUsuario(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useUsuarios } from 'composables/useUsuarios';
import { UsuarioStatus } from 'constants/enums';
import type { UsuarioResumoDto } from 'types/dtos/usuario.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const {
  usuarios,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
  nomeCompleto,
  rotuloStatus,
  rotuloPerfil,
  variantStatus,
  podeInativar,
} = useUsuarios();

const busca = ref('');

const colunas: QTableColumn<UsuarioResumoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left', sortable: true },
  { name: 'perfil', label: 'Perfil', field: 'perfil', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const usuariosFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();

  if (!termo) {
    return usuarios.value;
  }

  return usuarios.value.filter((usuario) => {
    const nome = nomeCompleto(usuario).toLowerCase();
    const email = usuario.email.toLowerCase();

    return nome.includes(termo) || email.includes(termo);
  });
});

const descricaoVazia = computed(() => {
  if (busca.value) {
    return 'Nenhum usuário corresponde à busca aplicada.';
  }

  return 'Cadastre usuários para conceder acesso à sua empresa.';
});

async function inativarUsuario(usuario: UsuarioResumoDto): Promise<void> {
  const sucesso = await solicitarInativacao(usuario);

  if (sucesso) {
    await carregar();
  }
}

async function ativarUsuario(usuario: UsuarioResumoDto): Promise<void> {
  const sucesso = await solicitarAtivacao(usuario);

  if (sucesso) {
    await carregar();
  }
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.usuarios-list__busca {
  flex: 1;
  min-width: 240px;
}

.usuarios-list__acoes {
  white-space: nowrap;
}
</style>
